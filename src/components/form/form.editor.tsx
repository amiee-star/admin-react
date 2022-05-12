import Editor from "@/lib/wangEditor"
import serviceScene from "@/services/service.scene"
import urlFunc from "@/utils/url.func"
import React, { useEffect, useRef } from "react"
import firstIndentEditor, { menuKey } from "../editor/firstIndent.editor"
import brushEditor, { menuBrush } from "../editor/brush.editor"
import clearEditor, { menuClear } from "../editor/clear.editor"
interface Props {
	defaultContent?: string
	onChange?: (content?: string) => void
	editConf?: Omit<typeof Editor.prototype.config, "onchange">
	stat?: boolean
}
const FormEditor: React.FC<Props> = props => {
	const { onChange, editConf = {}, defaultContent } = props
	// console.log(defaultContent)
	const editorBox = useRef<HTMLDivElement>()
	const editor = useRef<Editor>()
	useEffect(() => {
		if (!editor.current && !!editorBox.current) {
			editor.current = new Editor(editorBox.current)
			// editor.current.config.menus.concat([])||defaultMenu;
			editor.current.config = { ...editor.current.config, ...editConf }
			editor.current.config.onchange = (newContent: string) => {
				!!onChange && onChange(newContent)
			}
			editor.current.config.customUploadImg = (files: File[], insert: (url: string) => void) => {
				// files 是 input 中选中的文件列表
				// insert 是获取图片 url 后，插入到编辑器的方法
				// 上传代码返回结果之后，将图片插入到编辑器中
				for (let index = 0; index < files.length; index++) {
					const file = files[index]
					let form = new FormData()
					form.append("file", file)
					//调用上传接口
					serviceScene.fileupload(form).then(res => {
						insert(`${urlFunc.replaceUrl(res.data.filePreviewUrl, "imageUrl")}`)
					})
				}
			}
			editor.current.config.pasteFilterStyle = false
			// editor.current.config.pasteIgnoreImg = true
			editor.current.config.pasteTextHandle = (content: any) => {
				// content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
				if (content == "" && !content) return ""
				let str = content
				str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "")
				str = str.replace(/<style>[\s\S]*?<\/style>/gi, "")
        str = str.replace(/<p\s+style="[^=>]*"([(\s+\w+=)|>])/g, '<p>')
        str = str.replace(/<table\s+style="[^=>]*"([(\s+\w+=)|>])/g, "<table>")
        str = str.replace(/<o:p>.*?<\/o:p>/g, "")
        str = str.replace(/<br\/>/g, "</p><p>")
        str = str.replace(/<p><\/\p>/g, "")
				str = str.replace(/@font-face{[^>]*div.Section0{page:Section0;}/g, "")

        
        console.log("🚀 ~ file: form.editor.tsx ~ line 55 ~ useEffect ~ str", str)
				return str
			}
			editor.current.menus.extend(menuKey, firstIndentEditor)
			editor.current.config.menus.push(menuKey)
			// editor.current.menus.extend(menuBrush, brushEditor)
			// editor.current.config.menus.push(menuBrush)
			editor.current.menus.extend(menuClear, clearEditor)
			editor.current.config.menus.push(menuClear)
			editor.current.create()
			props.stat && editor.current.disable()
		} else {
			// console.log(defaultContent)
			if (!!defaultContent) {
				editor.current.txt.html(defaultContent)
				props.stat && editor.current.disable()
			}
		}
		// return () => {
		// 	editor.current && editor.current.destroy()
		// }
	}, [defaultContent])
	return <div ref={editorBox} className="full" style={{ position: "relative" }} />
}

export default FormEditor
